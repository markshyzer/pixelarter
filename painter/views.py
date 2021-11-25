from django.shortcuts import render
from django.http import HttpResponse
import json
from PIL import Image
import numpy

def index(request):
    return render(request, 'test.html')
    # return HttpResponse("Hello, world. You're at the painter index.")

def gallery(request):
    return render(request, 'gallery.html')
    # return HttpResponse("Hello, world. You're at the gallery.")

# def add_masterpiece(request):
#     if request.method == 'POST':
#         post_data = json.loads(request.body.decode("utf-8"))
#         user=post_data['user']
#         masterpiece = post_data['art']
#         Masterpiece.objects.create(art=masterpiece, artist=user)
#         print(Masterpiece.objects.all())

def download(request):
    print('request received')
    if request.method == 'POST':
        post_data = json.loads(request.body.decode("utf-8"))
        art = numpy.array(post_data['art'])
        image = Image.fromarray(art.astype(numpy.uint8))
        x_size = art.shape[0]*20
        y_size = art.shape[1]*20
        image2 = image.resize((y_size, x_size), resample = Image.NEAREST)        
        response = HttpResponse(content_type='image/png')
        response['Content-Disposition'] = 'attachment'
        image2.save(response, "png")
        return response


